#!/bin/bash

# Script to migrate Nextra callouts to Docusaurus admonitions
# Usage: ./migrate-callouts.sh <directory>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    echo "Usage: $0 <directory> [options]"
    echo ""
    echo "Options:"
    echo "  -d, --dry-run    Show what would be changed without modifying files"
    echo "  -b, --backup     Create backup files (.bak)"
    echo "  -h, --help       Display this help message"
    echo ""
    echo "Example:"
    echo "  $0 ./docs --backup"
    exit 1
}

# Parse arguments
DIRECTORY=""
DRY_RUN=false
BACKUP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -b|--backup)
            BACKUP=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            if [ -z "$DIRECTORY" ]; then
                DIRECTORY="$1"
            else
                echo -e "${RED}Error: Unknown argument '$1'${NC}"
                usage
            fi
            shift
            ;;
    esac
done

# Check if directory is provided
if [ -z "$DIRECTORY" ]; then
    echo -e "${RED}Error: Directory argument is required${NC}"
    usage
fi

# Check if directory exists
if [ ! -d "$DIRECTORY" ]; then
    echo -e "${RED}Error: Directory '$DIRECTORY' does not exist${NC}"
    exit 1
fi

echo -e "${GREEN}Starting Nextra to Docusaurus callout migration...${NC}"
echo "Directory: $DIRECTORY"
echo "Dry run: $DRY_RUN"
echo "Backup: $BACKUP"
echo ""

# Counter for statistics
total_files=0
modified_files=0
total_replacements=0

# Function to process a single file
process_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    local made_changes=false
    local file_replacements=0

    # Create temporary file
    cp "$file" "$temp_file"

    # Map Nextra types to Docusaurus types
    # default -> note
    # error -> danger
    # Keep: warning, info, tip, caution

    # Pattern 1: <Callout type="TYPE">CONTENT</Callout> (single line)
    perl -i -pe 's/<Callout type="error">(.*?)<\/Callout>/:::danger\n$1\n:::/g' "$temp_file"
    perl -i -pe 's/<Callout type="default">(.*?)<\/Callout>/:::note\n$1\n:::/g' "$temp_file"
    perl -i -pe 's/<Callout type="(warning|info|tip|caution)">(.*?)<\/Callout>/:::$1\n$2\n:::/g' "$temp_file"

    # Pattern 2: Multi-line callouts with type
    perl -i -0777 -pe 's/<Callout type="error">\s*(.*?)\s*<\/Callout>/:::danger\n$1\n:::/gs' "$temp_file"
    perl -i -0777 -pe 's/<Callout type="default">\s*(.*?)\s*<\/Callout>/:::note\n$1\n:::/gs' "$temp_file"
    perl -i -0777 -pe 's/<Callout type="(warning|info|tip|caution)">\s*(.*?)\s*<\/Callout>/:::$1\n$2\n:::/gs' "$temp_file"

    # Pattern 3: Callout with emoji (convert to note with emoji in title)
    perl -i -0777 -pe 's/<Callout emoji="(.*?)">\s*(.*?)\s*<\/Callout>/:::note $1\n$2\n:::/gs' "$temp_file"

    # Pattern 4: Callout with type and emoji (prefer type, add emoji to first line if needed)
    perl -i -0777 -pe 's/<Callout type="error" emoji=".*?">\s*(.*?)\s*<\/Callout>/:::danger\n$1\n:::/gs' "$temp_file"
    perl -i -0777 -pe 's/<Callout type="default" emoji=".*?">\s*(.*?)\s*<\/Callout>/:::note\n$1\n:::/gs' "$temp_file"
    perl -i -0777 -pe 's/<Callout type="(warning|info|tip|caution)" emoji=".*?">\s*(.*?)\s*<\/Callout>/:::$1\n$2\n:::/gs' "$temp_file"

    # Pattern 5: Callout without type (default to note)
    perl -i -0777 -pe 's/<Callout>\s*(.*?)\s*<\/Callout>/:::note\n$1\n:::/gs' "$temp_file"

    # Check if file was modified
    if ! cmp -s "$file" "$temp_file"; then
        made_changes=true
        file_replacements=$(diff "$file" "$temp_file" | grep -c "^<" || true)
    fi

    if [ "$made_changes" = true ]; then
        if [ "$DRY_RUN" = true ]; then
            echo -e "${YELLOW}Would modify: $file${NC}"
            diff "$file" "$temp_file" || true
            echo ""
        else
            if [ "$BACKUP" = true ]; then
                cp "$file" "${file}.bak"
                echo -e "${GREEN}Created backup: ${file}.bak${NC}"
            fi
            mv "$temp_file" "$file"
            echo -e "${GREEN}Modified: $file${NC}"
            ((modified_files++))
            ((total_replacements+=file_replacements))
        fi
    else
        rm "$temp_file"
    fi

    ((total_files++))
}

# Find all markdown and MDX files
echo "Searching for .md and .mdx files..."
while IFS= read -r -d '' file; do
    # Skip backup files
    if [[ "$file" == *.bak ]]; then
        continue
    fi

    # Check if file contains Callout tags
    if grep -q "<Callout" "$file"; then
        process_file "$file"
    else
        ((total_files++))
    fi
done < <(find "$DIRECTORY" -type f \( -name "*.md" -o -name "*.mdx" \) -print0)

echo ""
echo -e "${GREEN}Migration complete!${NC}"
echo "Total files scanned: $total_files"
echo "Files modified: $modified_files"
echo "Approximate replacements: $total_replacements"

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}This was a dry run. No files were actually modified.${NC}"
    echo "Run without --dry-run to apply changes."
fi

if [ "$BACKUP" = true ] && [ "$DRY_RUN" = false ] && [ $modified_files -gt 0 ]; then
    echo -e "${GREEN}Backup files created with .bak extension${NC}"
fi
