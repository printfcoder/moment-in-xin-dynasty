import {deletePeople, listPeople, relateToMe} from '@/services/history/listPeople';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Button, message, Popconfirm, Table} from 'antd';
import React, {useRef, useState} from 'react';
import PeopleForm, {modelType} from './components/PeopleForm';
import {PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import PeopleRelation = History.PeopleRelation;
import type {ColumnsType} from "antd/es/table";

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: History.People[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deletePeople({id: selectedRows[0].id});
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};


export type modelState = {
  modelType: modelType;
  currentPeopleId: number;
  isModalOpen: boolean;
};

const peopleRelationData = {}

const peopleRelationTableRender = (record: History.People) => {
  interface DataType {
    key: string;
    name: string;
    age: number;
    tel: string;
    phone: number;
    address: string;
  }

  // In the fifth row, other columns are merged into first column
  // by setting it's colSpan to be 0
  const sharedOnCell = (_: DataType, index: number) => {
    if (index === 4) {
      return {colSpan: 0};
    }

    return {};
  };

  const columns: ColumnsType<History.PeopleRelation> = [
    {
      title: <FormattedMessage id="pages.people.name" defaultMessage="人物"/>,
      dataIndex: 'peopleIDA',
      render: text => <a>{text}</a>,
      onCell: (_, index) => ({
        colSpan: (index as number) < 4 ? 1 : 5,
      }),
    },
    {
      title: <FormattedMessage id="pages.people.relationOrder" defaultMessage="顺位"/>,
      dataIndex: 'relationIdx',
      onCell: sharedOnCell,
    },
    {
      title: <FormattedMessage id="pages.people.relationStart" defaultMessage="顺位"/>,
      dataIndex: 'age',
      onCell: sharedOnCell,
    },
    {
      title: <FormattedMessage id="pages.people.relationEnd" defaultMessage="始"/>,
      colSpan: 2,
      dataIndex: 'tel',
      onCell: (_, index) => {
        if (index === 2) {
          return {rowSpan: 2};
        }
        // These two are merged into above cell
        if (index === 3) {
          return {rowSpan: 0};
        }
        if (index === 4) {
          return {colSpan: 0};
        }

        return {};
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="终"/>,
      colSpan: 0,
      dataIndex: 'phone',
      onCell: sharedOnCell,
    }
  ];

  return <Table columns={columns} dataSource={peopleRelationData[record.id]} bordered pagination={false}/>
};

const onExpand = async (expanded: boolean, record: History.People) => {
  if (expanded) {
    const hide = message.loading('正在加载' + record.name + "人物关系");
    try {
      const rsp: Common.HTTPRsp<PeopleRelation[]> = await relateToMe({id: record.id});
      if (rsp.success) {
        peopleRelationData[record.id] = rsp.data
      } else {
        message.error('加载失败：' + rsp.error);
      }
      hide();
      return;
    } catch (error) {
      hide();
      message.error('加载失败');
      return;
    }
  }
}

const PeopleList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [modelState, handleModalVisible] = useState<modelState>({
    currentPeopleId: 0,
    modelType: modelType.ADD,
    isModalOpen: false
  });
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<History.People[]>([]);

  const columns: ProColumns<History.People>[] = [
    {
      title: <FormattedMessage id="pages.people.id" defaultMessage="id"/>,
      dataIndex: 'id',
      sorter: true,
      hideInSearch: true,
      hideInForm: true
    },
    {
      title: <FormattedMessage id="pages.people.name" defaultMessage="人物"/>,
      dataIndex: 'name',
      sorter: true,
      hideInSearch: false,
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.people.birthday" defaultMessage="生年"/>,
      dataIndex: 'birthDay',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string) =>
        `${val}`,
    },
    {
      title: <FormattedMessage id="pages.people.deathday" defaultMessage="卒年"/>,
      dataIndex: 'deathDay',
      sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string) =>
        `${val}`,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作"/>,
      dataIndex: 'id',
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: number) => {
        return <>
          <Button key={val} type="text"
                  onClick={() => {
                    handleModalVisible({
                      currentPeopleId: val,
                      modelType: modelType.UPDATE,
                      isModalOpen: true
                    });
                  }}>
            修改
          </Button>
          <Popconfirm title="确认删除？" onConfirm={() => {
            handleModalVisible({
              currentPeopleId: val,
              modelType: modelType.DELETE,
              isModalOpen: true
            });
          }
          } icon={<QuestionCircleOutlined style={{color: 'red'}}/>}>
            <a href="#">删除</a>
          </Popconfirm>
        </>
      }
    },
  ];

  return (
    <PageContainer>
      <ProTable<History.People, Common.PageParams>
        actionRef={actionRef}
        rowKey="id"
        showHeader={true}
        search={
          {
            collapsed: false,
          }
        }
        toolBarRender={() => [
          <Button key="3" type="primary"
                  onClick={() => {
                    handleModalVisible({
                      currentPeopleId: 0,
                      modelType: modelType.ADD,
                      isModalOpen: true
                    });
                  }}>
            <PlusOutlined/>
          </Button>,
        ]}
        request={listPeople}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        expandable={{expandedRowRender: peopleRelationTableRender, onExpand}}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen2" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls2"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.id!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万2"/>
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}

      <PeopleForm updateModalVisible={modelState.isModalOpen}
                  peopleId={modelState.currentPeopleId}
                  modelType={modelState.modelType}
                  close={() => {
                    handleModalVisible({
                      currentPeopleId: 0,
                      isModalOpen: false,
                      modelType: modelType.ADD,
                    })
                  }}
                  open={() => {
                    handleModalVisible({
                      currentPeopleId: 0,
                      isModalOpen: true,
                      modelType: modelType.ADD,
                    })
                  }}/>
    </PageContainer>
  );
};

export default PeopleList;
