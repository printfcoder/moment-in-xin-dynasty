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
import {Button, Form, message, Input} from 'antd';
import React from "react";
import {peoples, RelationEnum} from "@/services/history/peoples";

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
                    let birth2deathDay: string = ""
                    let people: History.PeopleListItem;
                    if (allPeoples != null) {
                      allPeoples.some((v) => {
                        if (v.id == relationPeople) {
                          people = v
                          return true
                        }

                        return false
                      })

                      if (people == null) {
                        message.error('未找到人物!');
                        return
                      }
                      birth2deathDay = people.birthDay + "-" + people.deathDay
                    }

                    return <>
                      <ProFormText bordered={false} label={"id"}>
                        {people && people.id}
                      </ProFormText>
                      <ProFormText bordered={false} label={"生忌日"}>
                        {birth2deathDay}
                      </ProFormText>
                    </>
                  }}
                </ProFormDependency>
                <ProFormSelect
                  name="relation"
                  label="关系"
                  showSearch={true}
                  dependencies={['name']}
                  request={RelationEnum}
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
