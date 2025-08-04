import { Callout } from 'nextra/components';

import { LATEST_IOS_VERSION } from '../lib/sdk-versions';

interface VersionCalloutProps {
  docType?: string;
}

export function VersionCallout({ docType = '' }: VersionCalloutProps) {
  const docPath = docType ? `/${docType}` : '';

  return (
    <div className="my-6">
      <Callout type="info">
        You are viewing the latest iOS SDK documentation ({LATEST_IOS_VERSION}). For older versions,
        see <a href={`v0.2.0${docPath}`}>v0.2.0</a> and <a href={`v0.1.0${docPath}`}>v0.1.0</a>.
      </Callout>
    </div>
  );
}
