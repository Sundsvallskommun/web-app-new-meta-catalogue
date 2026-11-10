import { Avatar } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import Image from 'next/image';
import { useState } from 'react';

interface PersonAvatarProps {
  personId: string;
  givenname?: string | null;
  lastname?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({ personId, givenname, lastname, size = 'lg' }) => {
  const [failedImagePersonId, setFailedImagePersonId] = useState<string>();
  const initials = `${givenname?.charAt(0) ?? ''}${lastname?.charAt(0) ?? ''}`;

  return (
    <Avatar
      size={size}
      rounded
      className="shrink-0"
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
  );
};

interface PersonHeaderProps {
  personId: string;
  givenname?: string | null;
  lastname?: string | null;
  personNumber?: string | null;
  details?: { label: string; value?: string | null }[];
}

export const PersonHeader: React.FC<PersonHeaderProps> = ({ personId, givenname, lastname, personNumber, details }) => {
  return (
    <div className="flex items-center gap-24">
      <PersonAvatar personId={personId} givenname={givenname} lastname={lastname} />
      <div>
        <h4 className="text-lead">
          {givenname} {lastname}
        </h4>
        <span>{personNumber}</span>
        {details?.length > 0 && (
          <dl className="flex flex-wrap gap-x-32 gap-y-16 mt-16">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-label-medium">{detail.label}</dt>
                <dd>{detail.value || 'Inga uppgifter'}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
};
