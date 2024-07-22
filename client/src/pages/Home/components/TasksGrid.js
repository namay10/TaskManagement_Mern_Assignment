import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import dateFormatter from '../../../components/utils/dateFormatter';

const TaskGrid = ({ tasks, loading, onDragEnd }) => {
  const columns = {
    'to-do': {
      name: 'To Do',
      items: tasks.filter(task => task.status === 'To Do'),
    },
    pending: {
      name: 'Pending',
      items: tasks.filter(task => task.status === 'Pending'),
    },
    completed: {
      name: 'Completed',
      items: tasks.filter(task => task.status === 'Completed'),
    },
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col lg:flex-row justify-between my-5 space-y-4 lg:space-y-0 lg:space-x-4">
        {loading ? (
          <div className="my-5 text-gray-600">Loading...</div>
        ) : (
          Object.entries(columns).map(([columnId, column]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 p-4 rounded-lg ${
                    snapshot.isDraggingOver ? 'bg-lightblue' : 'bg-gray-200'
                  }`}
                  style={{ minHeight: '60vh' }}
                >
                  <h2 className="font-noto text-center font-bold text-xl lg:text-2xl text-gray-800 mb-4">{column.name}</h2>
                  {column.items.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <Link
                          className={`block p-4 mb-4 rounded-lg shadow-md ${
                            snapshot.isDragging ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
                          }`}
                          to={`/tasks/${task._id}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className="mb-4">
                            <h3 className="font-bold mb-2 text-lg">{task.title}</h3>
                            <p className="mb-2">{task.description}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="bg-gray-300 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold">
                              {task.status} task
                            </span>
                            <span className="bg-gray-300 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold">
                              Deadline {dateFormatter(task.deadline)}
                            </span>
                          </div>
                        </Link>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))
        )}
      </div>
    </DragDropContext>
  );
};

export default TaskGrid;
