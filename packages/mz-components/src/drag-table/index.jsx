import React from 'react';
import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import 'antd/dist/antd.css';
import './DragTable.less';

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />,
      ),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, (connect) => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

class DragSortingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [...props.data],
      columns: [...props.columns],
      loading: props.loading,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: [...nextProps.data],
      loading: nextProps.loading,
    });
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow(record, index, dragIndex, hoverIndex) {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    const dropRow = data[hoverIndex];
    this.setState(
      update(this.state, {
        data: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }),
    );
    this.props.onChangeSort({
      dragRow,
      dropRow,
      srcPos: dragIndex,
      destPos: hoverIndex,
    });
  }

  render() {
    return (
      <Table
        bordered
        loading={this.state.loading}
        columns={this.state.columns}
        dataSource={this.state.data}
        components={this.components}
        pagination={false}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow.bind(this, record, index),
        })}
      />
    );
  }
}

const WrapDragTable = DragDropContext(HTML5Backend)(DragSortingTable);
export default WrapDragTable;
