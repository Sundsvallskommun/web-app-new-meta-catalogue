import { Avatar } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import Image from 'next/image';
import { useState } from 'react';

interface PersonHeaderProps {
  personId: string;
  givenname?: string | null;
  lastname?: string | null;
  personNumber?: string | null;
}

export const PersonHeader: React.FC<PersonHeaderProps> = ({ personId, givenname, lastname, personNumber }) => {
  const [failedImagePersonId, setFailedImagePersonId] = useState<string>();
  const initials = `${givenname?.charAt(0) ?? ''}${lastname?.charAt(0) ?? ''}`;

  return (
    <div className="flex items-center gap-24">
      <Avatar
        size="lg"
        rounded
        initials={initials}
        imageElement={
          failedImagePersonId === personId ? undefined : (
            <Image
              unoptimized
              src={apiURL(`/employee/${personId}/personimage`)}
              width={64}
              height={64}
              alt=""
              className=""
              onError={() => setFailedImagePersonId(personId)}
            />
          )
        }
      />
      <div>
        <h4 className="text-lead">
          {givenname} {lastname}
        </h4>
        <span>{personNumber}</span>
      </div>
    </div>
  );
};
