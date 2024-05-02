import RectangleIcon from '@mui/icons-material/Rectangle';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

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
          className={`${view === `card` ? `activecard` : `text-neutral-500`} draftShowAs`}
        >
          <RectangleIcon sx={{ fontSize: '2.5rem' }}></RectangleIcon>
        </button>
      </span>
      <span>
        <button
          title="Lista"
          aria-labelledby="show-as-liststyle"
          onClick={() => handleOnClick('list')}
          className={`${view === `list` ? `activelist` : `text-neutral-500`} draftShowAs`}
        >
          <FormatListBulletedIcon sx={{ fontSize: '2.5rem' }}></FormatListBulletedIcon>
        </button>
      </span>
    </div>
  );
};
export default DraftViewAs;
