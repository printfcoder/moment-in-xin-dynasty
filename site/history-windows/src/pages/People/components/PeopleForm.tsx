import {PlusOutlined} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
  ProFormText,
} from '@ant-design/pro-components';
import {Button, Form} from 'antd';
import React from "react";

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type PeopleFormProps = {
  onCancel?: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit?: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean
  values?: Partial<API.RuleListItem>;
};

const PeopleForm: React.FC<PeopleFormProps> = (props) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      layout="horizontal"
      open={props.updateModalVisible}
      title={props.updateModalVisible ? "修改人物" : "新增人物"}
      trigger={
        <Button type="primary">
          <PlusOutlined/>
          新建表单
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width={120}
          label="姓名"
        />
        <ProFormText name="birthday" label="生日" placeholder="请输入生日"/>
        <ProFormText name="deathday" label="忌日" placeholder="请输入忌日"/>
      </ProForm.Group>
      <ProFormGroup>
        <ProFormList
          name={['default', 'users']}
          label="人物关系"
          initialValue={[
            {
              name: '我是姓名',
            },
          ]}
          itemContainerRender={(doms) => {
            return <ProFormGroup>{doms}</ProFormGroup>;
          }}
        >
          {(f, index, action) => {
            console.log(f, index, action);
            return (
              <>
                <ProFormText width={30} initialValue={index} name="rowKey" label={`id`}/>
                <ProFormSelect
                  name="name"
                  label="姓名"
                  dependencies={['name']}
                  request={async (params) => [
                    {label: params.name, value: 'all'},
                    {label: 'Unresolved', value: 'open'},
                    {label: 'Resolved', value: 'closed'},
                    {label: 'Resolving', value: 'processing'},
                  ]}
                />
                <ProFormSelect
                  name="relation"
                  label="关系"
                  dependencies={['name']}
                  request={async (params) => [
                    {label: params.name, value: 'all'},
                    {label: 'Unresolved', value: 'open'},
                    {label: 'Resolved', value: 'closed'},
                    {label: 'Resolving', value: 'processing'},
                  ]}
                />
              </>
            );
          }}
        </ProFormList>
      </ProFormGroup>
    </ModalForm>
  );
};

export default PeopleForm;
