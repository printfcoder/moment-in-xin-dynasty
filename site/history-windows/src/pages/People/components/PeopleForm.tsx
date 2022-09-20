import {PlusOutlined} from '@ant-design/icons';
import {
  ModalForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
  ProFormText, ActionType, ProFormDigit, ProCard,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import React, {useRef} from "react";
import {addPeople, peoples, RelationEnum} from "@/services/history/peoples";

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
  values?: Partial<History.People>;
};

let allPeoples: History.People[];

const PeopleForm: React.FC<PeopleFormProps> = (props) => {
  const [form] = Form.useForm<{ people: History.People, relationPeoples: History.PeopleRelation[] }>();
  const actionRef = useRef<ActionType>();

  return (
    <ModalForm<{
      people: History.People;
      relationPeoples: History.PeopleRelation[];
    }>
      width={1200}
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
      onFinish={async (formData) => {
        console.log(formData)
        const success = await addPeople(formData);
        if (success) {
          props.updateModalVisible = false;
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
    >
      <ProFormGroup key="people">
        <ProFormText
          name={["people", "name"]}
          width={120}
          label="姓名"
        />
        <ProFormText name={["people", "birthDay"]} label="生日" placeholder="请输入生日"/>
        <ProFormText name={["people", "deathDay"]} label="忌日" placeholder="请输入忌日"/>
      </ProFormGroup>
      <ProFormGroup key="relationPeoples">
        <ProFormList
          name={['relationPeoples']}
          label="关系"
          rules={[
            {
              validator: async (_, value) => {
                console.log(value);
                if (value && value.length > 0) {
                  return;
                }
                throw new Error('至少要有一项！');
              },
            },
          ]}
        >
          <ProFormGroup key="group">
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
                let people: History.People;
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
                  <ProFormText bordered={false} label={"识别"}>
                    {people && people.id}: {birth2deathDay}
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
            <ProFormDigit name="relationIdx" min={1} label="顺位"/>
            <ProFormText name="relationBegin" label="始"/>
            <ProFormText name="relationEnd" label="终"/>
          </ProFormGroup>
        </ProFormList>
      </ProFormGroup>
    </ModalForm>
  );
};

export default PeopleForm;
