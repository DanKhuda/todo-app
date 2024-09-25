import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader';
import { updateTodo } from '../../api/todos';
import { ErrorMessages } from '../../constants/ErrorMessages';

interface Props {
  todo: Todo;
  isSubmitting?: boolean;
  isLoading?: boolean;
  onDeleteTodo?: (todoId: number) => void;
  onCompleteTodo?: (todoId: number, completed: boolean) => void;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingTodoIds?: React.Dispatch<React.SetStateAction<number[]>>;
  setError?: React.Dispatch<SetStateAction<ErrorMessages | null>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmitting = false,
  onDeleteTodo = () => {},
  onCompleteTodo = () => {},
  setTodos = () => {},
  setLoadingTodoIds = () => {},
  setError = () => {},
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleBlurOrSubmit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!editTitle.trim()) {
      onDeleteTodo(id);
    } else if (editTitle !== title) {
      setLoadingTodoIds(prevIds => [...prevIds, id]);

      updateTodo(id, { title: editTitle })
        .then(() => {
          setTodos((prevTodos: Todo[]) =>
            prevTodos.map(prevTodo =>
              prevTodo.id === id
                ? { ...prevTodo, title: trimmedTitle }
                : prevTodo,
            ),
          );
          setIsEditing(false);
        })
        .catch(() => {
          setError(ErrorMessages.UpdateTodo);
        })
        .finally(() => {
          setLoadingTodoIds(prevIds => prevIds.filter(prevId => prevId !== id));
        });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onCompleteTodo(id, !completed)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleBlurOrSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlurOrSubmit}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isSubmitting={isSubmitting} />
    </div>
  );
};
