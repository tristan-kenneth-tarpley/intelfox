import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

const CalloutSection = ({
  header,
  message,
  theme = 'warning',
}: {
  header: string;
  message: string;
  theme?: 'warning' | 'success';
}) => {
  return (
    <div className={classNames('rounded-md p-4 ', {
      'bg-yellow-50': theme === 'warning',
      'bg-green-50': theme === 'success',
    })}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={classNames('h-5 w-5', {
            'text-yellow-400': theme === 'warning',
            'text-green-400': theme === 'success',
          })} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className={classNames('text-sm font-medium', {
            'text-yellow-800': theme === 'warning',
            'text-green-800': theme === 'success',
          })}>{header}</h3>
          <div className={classNames('mt-2 text-xs', {
            'text-yellow-700': theme === 'warning',
            'text-green-700': theme === 'success',
          })}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalloutSection;
