import React from 'react';
import { TodoForm } from '../TodoForm';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  newTodoTitle: string;
  isSubmitting: boolean;
  todos: Todo[];
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewTodoSubmit: (e: React.FormEvent) => void;
  handleToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  isSubmitting,
  todos,
  handleTitleChange,
  handleNewTodoSubmit,
  handleToggleAll,
}) => {
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      <TodoForm
        newTodoTitle={newTodoTitle}
        isSubmitting={isSubmitting}
        onTitleChange={handleTitleChange}
        onSubmit={handleNewTodoSubmit}
      />
    </header>
  );
};
