import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { PageProps } from '@/app/types';
import TeamLoader from '@/components/TeamLoader';
import classNames from 'classnames';
import db from '@/lib/services/db/db';
import Button from '@/components/ui/Button';
import { TrashIcon } from '@heroicons/react/20/solid';
import { innerPadding } from '../styles';
import Navbar from '../../../../components/navbar/ApplicationHomeNavbar';

const KeyphrasesPage = ({ params }: PageProps) => {
  const { teamId } = params;

  return (
    <TeamLoader teamId={teamId}>
      {async ({ team }) => {
        const trackedKeyPhrases = await db.trackedKeyPhrases.findMany({
          where: {
            teamId,
          },
        });

        return (
          <div>
            <Navbar team={team} />
            <div className={classNames(innerPadding)}>
              <div className="flex flex-col space-y-2">
                {trackedKeyPhrases
                  .filter(({ traits }) => !traits.includes('BRANDED'))
                  .map(({ phrase, id }) => {
                    return (
                      <div className='flex items-center space-x-2' key={id}>
                        <AlertDialog>
                          <AlertDialogTrigger className="flex items-center space-x-2">
                            <Button variant='danger' iconLeft={<TrashIcon className="w-3 h-3" />} />
                            <span>{phrase}</span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this key phrase?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You will no longer receive alerts or updates for this key phrase.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel><Button variant='secondary'>Cancel</Button></AlertDialogCancel>
                            <AlertDialogAction><Button>Continue</Button></AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        );
      }}
    </TeamLoader>
  );
};

export default KeyphrasesPage;
