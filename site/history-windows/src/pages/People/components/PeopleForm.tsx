import {
  ModalForm,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormDependency,
  ProFormText, ProFormDigit,
} from '@ant-design/pro-components';
import {Form, message} from 'antd';
import React from "react";
import {
  addPeople,
  getPeople,
  listPeople,
  RelationEnum,
  deletePeople,
  updatePeople
} from "@/services/history/listPeople";
import History from "@/services/history/typings";
import People = History.People;

export enum modelType {
  UPDATE = 0,
  DELETE = 1,
  ADD = 2
}

export type PeopleFormProps = {
  updateModalVisible: boolean;
  modelType: modelType;
  peopleId: number;
  close: () => void;
  open: () => void;
  values?: Partial<People>;
};

let allPeoples: History.People[];

const handleAdd = async (formData: History.PeopleRelations) => {
  const ret = await addPeople(formData);
  if (ret.success) {
    console.log(ret)
  } else {
    if (ret.error) {
      message.error(ret.error.msg);
    }
    return false
  }
  return true;
};

const handleDelete = async (id: number) => {
  // 再次确认
  const ret = await deletePeople({id: id});
  if (ret.success) {
    message.success("删除成功");
  } else {
    if (ret.error) {
      message.error(ret.error.msg);
    }
    return false
  }
  return true;
};


const handleUpdate = async (formData: History.PeopleRelations) => {
  const ret = await updatePeople(formData);
  if (ret.success) {
    console.log(ret)
  } else {
    if (ret.error) {
      message.error(ret.error.msg);
    }
    return false
  }
  return true;
};

const handleGet = async (id: number) => {
  const ret = await getPeople({id: id});
  if (ret.success) {
    console.log(ret)
  } else {
    if (ret.error) {
      message.error(ret.error.msg);
    }
    return null
  }
  return ret.data;
};

const parseTitle = function (tp: modelType) {
  if (tp == modelType.ADD) {
    return "新增人物"
  }

  if (tp == modelType.UPDATE) {
    return "修改人物"
  }

  return "删除人物（以下人物和关系将被删除）"
}

const PeopleForm: React.FC<PeopleFormProps> = (props) => {
  const [form] = Form.useForm<{ people: History.People, relations: History.PeopleRelation[] }>();
  return (
    <ModalForm<{
      people: History.People;
      relations: History.PeopleRelation[];
    }>
      open={props.updateModalVisible}
      width={1200}
      layout="horizontal"
      onInit={function () {
        if (props.peopleId > 0) {
          handleGet(props.peopleId).then(function (data) {
            if (data != null) {
              form.setFieldsValue({
                people: data.people,
                relations: data.relations,
              })
            }
          })
        }

        listPeople({pageSize: 100000}).then((res) => {
          allPeoples = res.data
        });
      }}
      title={parseTitle(props.modelType)}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          props.close()
        },
      }}
      submitTimeout={2000}
      onFinish={(formData) => {
        switch (props.modelType) {
          case modelType.UPDATE:
            handleUpdate(formData).then(() => {
              props.close()
            })
            break
          case modelType.ADD:
            handleAdd(formData).then(() => {
              props.close()
            })
            break
          case modelType.DELETE:
            handleDelete(formData.people.id).then(() => {
              props.close()
            })
            break
        }
      }}
    >
      <
        ProFormGroup
        key="people">
        < ProFormText
          name={["people", "id"
          ]
          }
          hidden={true}
        />
        <ProFormText
          name={["people", "name"]}
          width={120}
          label="姓名"
          rules={[
            {
              validator: async (_, value) => {
                if (value && value.length > 0) {
                  return;
                }
                throw new Error('请填写人物');
              },
            },
          ]}
        />
        <ProFormText name={["people", "birthDay"]} label="生日" placeholder="请输入生日"/>
        <ProFormText name={["people", "deathDay"]} label="忌日" placeholder="请输入忌日"/>
      </ProFormGroup>
      <ProFormGroup key="relations">
        <ProFormList
          name={['relations']}
          label="关系"
        >
          <ProFormGroup key="group">
            <ProFormSelect
              name="peopleIDB"
              label=""
              showSearch={true}
              request={async ({}) => {  // request使用params传入的参数，每次都触发了
                const arr: any = [];
                console.log(2)
                allPeoples.forEach(v => {
                  arr.push({
                    label: v.name,
                    value: v.id,
                  })
                })

                return arr;
              }}
              rules={[
                {
                  validator: async (_, value) => {
                    if (value != null) {
                      return;
                    }
                    throw new Error('请选择人物！');
                  },
                },
              ]}
            />

            <ProFormDependency name={['peopleIDB']}>
              {({peopleIDB}) => {
                if (peopleIDB != null) {
                  let birth2deathDay: string = ""
                  let people: History.People;
                  if (allPeoples != null) {
                    allPeoples.some((v) => {
                      if (v.id == peopleIDB) {
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
                } else {
                  return <></>
                }
              }}
            </ProFormDependency>
            <ProFormSelect
              name="relation"
              label="关系"
              showSearch={true}
              dependencies={['name']}
              request={RelationEnum}
              rules={[
                {
                  validator: async (_, value) => {
                    if (value != null) {
                      return;
                    }
                    throw new Error('请选择关系！');
                  },
                },
              ]}
            />
            <ProFormDigit name="relationIdx" width={"sm"} min={1} label="顺位"/>
            <ProFormText name="relationBegin" label="始"/>
            <ProFormText name="relationEnd" label="终"/>
          </ProFormGroup>
        </ProFormList>
      </ProFormGroup>
    </ModalForm>
  )
    ;
};

export default PeopleForm;
