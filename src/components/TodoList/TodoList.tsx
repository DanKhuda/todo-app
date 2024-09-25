import React, { SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ErrorMessages } from '../../constants/ErrorMessages';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isSubmitting: boolean;
  submittingTodoIds: number[];
  handleDeleteTodo: (todoId: number) => void;
  handleCompleteTodo: (todoId: number, completed: boolean) => void;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingTodoIds?: React.Dispatch<React.SetStateAction<number[]>>;
  setError: React.Dispatch<SetStateAction<ErrorMessages | null>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isSubmitting,
  submittingTodoIds,
  handleDeleteTodo,
  handleCompleteTodo,
  setTodos,
  setLoadingTodoIds,
  setError,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            isSubmitting={submittingTodoIds.includes(todo.id)}
            onDeleteTodo={handleDeleteTodo}
            onCompleteTodo={handleCompleteTodo}
            setTodos={setTodos}
            setLoadingTodoIds={setLoadingTodoIds}
            setError={setError}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} isSubmitting={isSubmitting} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
