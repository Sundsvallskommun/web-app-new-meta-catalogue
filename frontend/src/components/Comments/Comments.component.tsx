import { Avatar, Button, Icon, Input, PopupMenu, Spinner } from '@sk-web-gui/react';
import { EllipsisVertical, Pencil, SendHorizontal, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface CommentData {
  id: string;
  commentorName: string;
  commentorUserName: string;
  commentText: string;
  publishDate: string;
}

interface CommentsProps {
  currentUserName: string;
  commentsData: CommentData[];
  onSubmitCallback: (comment: string) => void;
  /** Resolves to true when the edit was saved */
  onEditCallback: (comment: string, id: string) => Promise<boolean>;
  onDeleteCallback: (id: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  loading?: boolean;
}

export const Comments = ({
  currentUserName,
  commentsData,
  onSubmitCallback,
  onEditCallback,
  onDeleteCallback,
  inputValue,
  setInputValue,
  loading,
}: CommentsProps) => {
  const [editId, setEditId] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editId) {
      scrollRef.current?.scroll({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [commentsData, editId]);

  const onEdit = (comment: CommentData) => {
    setEditId(comment.id);
    setInputValue(comment.commentText);
  };

  const onSubmit = async () => {
    if (editId) {
      if (await onEditCallback(inputValue, editId)) {
        setEditId(undefined);
      }
    } else {
      onSubmitCallback(inputValue);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-md w-full min-h-0">
      <div className="overflow-y-auto min-h-0" ref={scrollRef}>
        {!loading && commentsData.length === 0 && (
          <p className="text-dark-secondary">Inga kommentarer ännu. Skriv den första nedan.</p>
        )}
        {!loading &&
          commentsData.map((comment) => (
            <div key={`comment-item-${comment.id}`} className="border-b-1 border-divider py-16">
              <div className="flex items-start gap-sm">
                <Avatar
                  size="sm"
                  rounded
                  className="shrink-0"
                  initials={comment.commentorName.slice(0, 2).toUpperCase()}
                />
                <div className={`w-full ${editId === comment.id ? 'p-sm rounded-lg bg-warning-background-200' : ''}`}>
                  <p>{comment.commentText}</p>
                  <p className="text-small text-dark-secondary">
                    / {comment.commentorName} {comment.publishDate}
                  </p>
                </div>
                {currentUserName === comment.commentorUserName ?
                  <PopupMenu type="menu" align="end">
                    <PopupMenu.Button
                      title="Redigera Kommentar"
                      aria-label="Redigera kommentar"
                      variant="tertiary"
                      size="sm"
                      iconButton
                    >
                      <EllipsisVertical />
                    </PopupMenu.Button>
                    <PopupMenu.Panel>
                      <PopupMenu.Items>
                        <PopupMenu.Item>
                          <Button onClick={() => onEdit(comment)} leftIcon={<Pencil />}>
                            Ändra kommentar
                          </Button>
                        </PopupMenu.Item>
                        <PopupMenu.Item>
                          <Button onClick={() => onDeleteCallback(comment.id)} leftIcon={<Trash />}>
                            Ta bort
                          </Button>
                        </PopupMenu.Item>
                      </PopupMenu.Items>
                    </PopupMenu.Panel>
                  </PopupMenu>
                : <div className="w-32 shrink-0" />}
              </div>
            </div>
          ))}
        {loading && (
          <div className="w-full flex items-center justify-center py-lg">
            <Spinner size={4} />
          </div>
        )}
      </div>
      <div className="comment-input mt-auto flex items-center gap-sm">
        <Input
          id="comment-input"
          ref={inputRef}
          className="w-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Skriv en kommentar"
        />
        <Button
          iconButton
          variant="tertiary"
          aria-label={editId ? 'Spara kommentar' : 'Skicka kommentar'}
          disabled={inputValue.length === 0}
          onClick={onSubmit}
        >
          <Icon icon={<SendHorizontal />} />
        </Button>
      </div>
    </div>
  );
};

export default Comments;
