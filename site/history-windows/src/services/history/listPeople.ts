// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

let loadedRelationEnum: any[] = [];

/** 获取人物列表 GET */
export async function listPeople(
  params: {
    /** 名字搜索 */
    name?: string,
    /** 当前的页码 */
    pageNo?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<Common.HTTPRsp<Common.PageData<History.People>>>('/api/history/people/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((rsp: Common.HTTPRsp<Common.PageData<History.People>>) => {
    return toAntDPage(rsp)
  })
}

/** 获取人物 */
export async function getPeople(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<Common.HTTPRsp<History.PeopleRelations>>('/api/history/people/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 新建人物 */
export async function addPeople(data: History.PeopleRelations, options?: { [key: string]: any }) {
  return request<Common.HTTPRsp<any>>('/api/history/people/add', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 更新人物 */
export async function updatePeople(data: History.PeopleRelations, options?: { [key: string]: any }) {
  return request<Common.HTTPRsp<any>>('/api/history/people/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 删除人物 */
export async function removePeople(params: {
  id: number;
}, options?: { [key: string]: any }) {
  return request<Common.HTTPRsp<any>>('/api/history/people/remove', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 人物关系枚举 */
export async function RelationEnum(options?: { [key: string]: any }) {
  if (loadedRelationEnum.length > 0) {
    return loadedRelationEnum
  }
  return request<Common.HTTPRsp<String[]>>('/api/history/relation-enum', {
    method: 'GET',
    ...(options || {}),
  }).then((rsp: Common.HTTPRsp<String[]>) => {
    rsp.data && rsp.data.forEach(v => {
      loadedRelationEnum.push({
        label: v,
        value: v,
      })
    })

    return loadedRelationEnum
  })
}


/**
 * 转成antDesign的Page格式
 */
function toAntDPage(backendData: Common.HTTPRsp<Common.PageData<History.People>>) {
  let ret: Common.AntDesignPage<History.People> = {
    data: [],
    total: 0,
  }

  if (backendData.data && backendData.data.list) {
    ret.data = backendData.data.list
    ret.total = backendData.data.total
  }

  return ret
}