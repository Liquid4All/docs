import { IconArrowRight } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { CONTACT_EMAIL } from '@/constants';

export default function Example() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h3>404</h3>
          <h1 className="mt-1">Oops! Page not found</h1>
          <p className="mt-4">We could not find the page you’re looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button variant="default" href="/">
              Go Back Home
            </Button>
            <Button
              variant="ghost"
              href={`mailto:${CONTACT_EMAIL}`}
              tooltipText="Tell us what went wrong"
              icon={IconArrowRight}
            >
              Email Support
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
