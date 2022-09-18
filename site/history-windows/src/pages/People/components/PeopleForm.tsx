import {HistoryOutlined, PlusOutlined} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
  ProFormText,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import React from "react";
import {peoples} from "@/services/history/peoples";
import PeopleList from "@/pages/People";

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
  values?: Partial<History.PeopleListItem>;
};

let allPeoples: History.PeopleListItem[];

const PeopleForm: React.FC<PeopleFormProps> = (props) => {
  const [form] = Form.useForm<{ name: string; birthday: string, deathday: string, relationPeoples: History.PeopleRelation[] }>();
  return (
    <ModalForm<{
      name: string;
      birthday: string;
      deathday: string;
      relationPeoples: History.PeopleRelation[];
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
          name={['relationPeoples']}
          label="关系"
          initialValue={[
            {
              name: '选择人物',
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
                <ProFormSelect
                  name="relationPeople"
                  label=""
                  showSearch={true}
                  request={async ({keyWords}) => {  // request使用params传入的参数，每次都触发了
                    const arr: any = [];
                    if (allPeoples == null) {
                      const res = await peoples({name: keyWords});
                      if (res) {
                        allPeoples = res.data
                      }
                    }
                    allPeoples && allPeoples.forEach(v => {
                      arr.push({
                        label: v.name,
                        value: v.id,
                      })
                    })

                    return arr;
                  }}
                />
                <ProFormDependency name={['relationPeople']}>
                  {({relationPeople}) => {
                    return <ProFormText disabled={true} width={30} initialValue={relationPeople}
                                        name="rowKey" label={`id`}/>
                  }}
                </ProFormDependency>
                <ProFormDependency name={['relationPeople']}>
                  {({relationPeople}) => {
                    if (allPeoples != null) {
                      let people: History.PeopleListItem;
                      allPeoples && allPeoples.forEach((v) => {
                        if (v.id == relationPeople) {
                          people = v
                          return
                        }
                      })
                      if (people == null) {
                        message.error('未找到人物!');
                        return
                      }
                      const birth2deathDay: string = people.birthday + "-" + people.deathday
                      return <ProFormText disabled={true} width={30}
                                          initialValue={"" || birth2deathDay} name="birth2deathDay"
                                          label={`生忌日`}/>
                    }
                    return <ProFormText disabled={true} width={30}
                                        initialValue={""} name="birth2deathDay"
                                        label={`生忌日`}/>
                  }}
                </ProFormDependency>
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
