import classNames from 'classnames';
import Button from './Button';

export default function BreadcrumbMenu({
  pages,
}: {
  pages: {
    name: string;
    href: string;
    current?: boolean;
  }[]
}) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-1">
        {pages.map((page, index) => (
          <li key={page.name}>
            <div className="flex items-center">
              {index > 0 && (
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              <Button
                href={page.href}
                variant="link"
                className={classNames('text-zinc-500 hover:text-zinc-400', {
                  'text-zinc-100 border-b border-solid border-b-zinc-100': page.current,
                })}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
