import { PostDraftCommentDto } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';
import { Comments, Modal, useMessage } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';

interface ICommentsSidebar {
  commentsSidebarOpen: boolean;
  onClose: () => void;
}

export default function CommentsSidebar(props: ICommentsSidebar) {
  const { commentsSidebarOpen, onClose } = props;
  const draft = useOrgChangeStore((s) => s.draft);
  const user = useUserStore((s) => s.user);
  const commentsIsLoading = useOrgChangeStore((s) => s.draftCommentsIsLoading);
  const postDraftComment = useOrgChangeStore((s) => s.postDraftComment);
  const editDraftComment = useOrgChangeStore((s) => s.editDraftComment);
  const deleteDraftComment = useOrgChangeStore((s) => s.deleteDraftComment);
  const draftComments = useOrgChangeStore((s) => s.draftComments);

  const patchMe = useUserStore((s) => s.patchMe);

  const message = useMessage();

  const [sidebarComments, setSidebarComments] = useState([]);

  useEffect(() => {
    const commentArr = [];
    if (draftComments) {
      draftComments.filter((comment) => {
        commentArr.push({
          id: comment.draftCommentId,
          commentorName: comment.loginname,
          commentorUserName: comment.loginname,
          commentText: comment.comment,
          publishDate: new Date(comment.createdDT).toLocaleString('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          draftId: comment.draftId,
        });
      });
    }

    setSidebarComments(commentArr);
  }, [draftComments]);

  useEffect(() => {
    patchMe({ readCommentsClearedDate: new Date().toISOString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [input, setInput] = useState('');

  //POST draftComment
  const postComment = () => {
    if (input) {
      const dataBody: PostDraftCommentDto = {
        draftId: draft.draftId,
        comment: input,
      };
      postDraftComment(dataBody).then((res) => {
        if (!res.error) {
          setInput('');
          message({
            message: `Din kommentar postas`,
            status: 'success',
          });
        } else {
          message({
            message: `Det gick inte att posta kommentaren, något gick fel`,
            status: 'error',
          });
        }
      });
    }
  };

  //PUT draftComment
  const editComment = (comment: string, id: string) => {
    if (comment && id) {
      editDraftComment(id, comment).then((res) => {
        if (!res.error) {
          setInput('');
          message({
            message: `Din kommentar ändrades`,
            status: 'success',
          });
        } else {
          message({
            message: `Det gick inte att ändra kommentaren, något gick fel`,
            status: 'error',
          });
        }
      });
    }
  };

  //DELETE draftComment
  const deleteComment = async (id: string) => {
    if (id) {
      await deleteDraftComment(id).then((res) => {
        if (!res.error) {
          message({
            message: `Din kommentar togs bort`,
            status: 'success',
          });
        } else {
          message({
            message: `Det gick inte att ta bort kommentaren, något gick fel`,
            status: 'error',
          });
        }
      });
    }
  };

  return (
    <Modal
      hideLabel
      label="Kommentarer"
      className="max-w-[500px] mt-0 mb-[-24px] absolute right-0 h-screen overflow-hidden"
      show={commentsSidebarOpen}
      onClose={onClose}
    >
      <div className="Comments-sidebar">
        <Comments
          currentUserName={user.username}
          commentsData={sidebarComments}
          onSubmitCallback={postComment}
          onEditCallback={editComment}
          onDeleteCallback={deleteComment}
          inputValue={input}
          setInputValue={setInput}
          loading={commentsIsLoading}
        />
      </div>
    </Modal>
  );
}
