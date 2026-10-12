import { Icon } from '@sk-web-gui/react';
import { List, Square } from 'lucide-react';

const DraftViewAs = (props) => {
  const { setView, view } = props;

  const handleOnClick = (view) => {
    setView(view);
  };

  return (
    <div className="flex">
      <label className="py-md mr-4" id="show-as-liststyle">
        Visa som:
      </label>
      <span className="mr-4">
        <button
          title="Kort"
          aria-labelledby="show-as-liststyle"
          onClick={() => handleOnClick('card')}
          className={`${view === `card` ? `activecard` : `text-dark-secondary`} draftShowAs`}
        >
          <Icon icon={<Square />} />
        </button>
      </span>
      <span>
        <button
          title="Lista"
          aria-labelledby="show-as-liststyle"
          onClick={() => handleOnClick('list')}
          className={`${view === `list` ? `activelist` : `text-dark-secondary`} draftShowAs`}
        >
          <Icon icon={<List />} />
        </button>
      </span>
    </div>
  );
};
export default DraftViewAs;
