import { Button } from '@sk-web-gui/react';
import { List, Square } from 'lucide-react';

const DraftViewAs = (props) => {
  const { setView, view } = props;

  return (
    <div className="flex gap-8">
      <Button
        iconButton
        rounded
        variant={view === 'card' ? 'primary' : 'tertiary'}
        title="Kort"
        aria-label="Visa som kort"
        aria-pressed={view === 'card'}
        onClick={() => setView('card')}
      >
        <Square />
      </Button>
      <Button
        iconButton
        rounded
        variant={view === 'list' ? 'primary' : 'tertiary'}
        title="Lista"
        aria-label="Visa som lista"
        aria-pressed={view === 'list'}
        onClick={() => setView('list')}
      >
        <List />
      </Button>
    </div>
  );
};
export default DraftViewAs;
