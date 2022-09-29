import {removePeople, listPeople} from '@/services/history/listPeople';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Button, message} from 'antd';
import React, {useRef, useState} from 'react';
import PeopleForm from './components/PeopleForm';
import {PlusOutlined, EditOutlined} from "@ant-design/icons";

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
    await removePeople({id: selectedRows[0].id});
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
  isModalOpen: boolean;
  isUpdateModel: boolean;
  currentPeopleId: number;
};

const PeopleList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [modelState, handleModalVisible] = useState<modelState>({
    currentPeopleId: 0,
    isUpdateModel: false,
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
          <Button key={val} type="primary"
                  onClick={() => {
                    handleModalVisible({
                      currentPeopleId: val,
                      isUpdateModel: true,
                      isModalOpen: true
                    });
                  }}>
            <EditOutlined/>
          </Button>
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
                      isUpdateModel: false,
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
                  isUpdateModel={modelState.isUpdateModel}
                  close={() => {
                    handleModalVisible({
                      currentPeopleId: 0,
                      isModalOpen: false,
                      isUpdateModel: false
                    })
                  }}
                  open={() => {
                    handleModalVisible({
                      currentPeopleId: 0,
                      isModalOpen: true,
                      isUpdateModel: false
                    })
                  }}/>
    </PageContainer>
  );
};

export default PeopleList;
