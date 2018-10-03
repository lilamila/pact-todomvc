import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, render } from 'enzyme';

import { Todo } from '../../../src/components/todos/todo';

const todoProps = {
  id: 1,
  entry: 'A Todo',
  state: 'active',
  deleted: false,
  onChangeEntry: jest.fn(),
  onUpdate: jest.fn(),
  onRemove: jest.fn(),
  onToggleState: jest.fn(),
};

describe('Todo Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render a todo', () => {
    const component = renderer.create(<Todo {...todoProps} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should correctly render icon based on state prop', () => {
    const active = render(<Todo {...todoProps} state="active" />);
    const activeIcon = active.find('.check button svg');
    expect(active.hasClass('active')).toBeTruthy();
    expect(activeIcon.prop('data-prefix')).toEqual('far');

    const completed = render(<Todo {...todoProps} state="completed" />);
    const completedIcon = completed.find('.check button svg');
    expect(completed.hasClass('completed')).toBeTruthy();
    expect(completedIcon.prop('data-prefix')).toEqual('fas');
  });

  test('should correctly set class on entry input based on entry length', () => {
    const filled = render(<Todo {...todoProps} entry="Some Text" />);
    const filledInput = filled.find('.entry input');
    expect(filledInput.hasClass('empty')).toBeFalsy();

    const empty = render(<Todo {...todoProps} entry="" />);
    const emptyInput = empty.find('.entry input');
    expect(emptyInput.hasClass('empty')).toBeTruthy();
  });

  test('should call onRemove() when clicking remove button', () => {
    const component = shallow(<Todo {...todoProps} />);
    const removeButton = component.find('.remove button');
    removeButton.simulate('click');
    expect(todoProps.onRemove).toHaveBeenCalled();
  });

  test('should call onToggleState() when clicking complete button button', () => {
    const active = shallow(<Todo {...todoProps} state="active" />);
    const activeButton = active.find('.check button');
    activeButton.simulate('click');
    expect(todoProps.onToggleState).toHaveBeenCalledWith(todoProps.id, 'completed');

    todoProps.onToggleState.mockClear();

    const completed = shallow(<Todo {...todoProps} state="completed" />);
    const completedButton = completed.find('.check button');

    completedButton.simulate('click');
    expect(todoProps.onToggleState).toHaveBeenCalledWith(todoProps.id, 'active');
  });

  test('should call changeEntry() when changing entry field', () => {
    const component = shallow(<Todo {...todoProps} />);
    const input = component.find('.entry input');
    const newValue = 'Something Else';
    input.simulate('change', { currentTarget: { value: newValue } });
    expect(todoProps.onChangeEntry).toHaveBeenCalledWith(todoProps.id, newValue);
  });

  test('should call onUpdate() when blurring entry field', () => {
    const component = shallow(<Todo {...todoProps} />);
    const input = component.find('.entry input');
    const newValue = 'Something Else';
    input.simulate('blur', { currentTarget: { value: newValue } });
    expect(todoProps.onUpdate).toHaveBeenCalledWith({
      id: todoProps.id,
      entry: newValue,
      state: todoProps.state,
      deleted: todoProps.deleted,
    });
  });

  test('should only call blur() on text field if keyDown keyCode is 13', () => {
    const component = shallow(<Todo {...todoProps} />);
    const input = component.find('.entry input');
    const newValue = 'Something Else';

    const currentTarget = { blur: jest.fn() };

    input.simulate('keyDown', { keyCode: 1, currentTarget });
    expect(currentTarget.blur).not.toHaveBeenCalled();

    input.simulate('keyDown', { keyCode: 13, currentTarget });
    expect(currentTarget.blur).toHaveBeenCalled();
  });
});