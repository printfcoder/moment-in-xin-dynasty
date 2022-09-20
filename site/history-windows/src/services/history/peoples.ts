// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

let loadedRelationEnum: any[] = [];

/** 获取规则列表 GET /api/rule */
export async function peoples(
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
  return request<Common.HTTPRsp<Common.PageData<History.People>>>('/api/history/peoples', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((rsp: Common.HTTPRsp<Common.PageData<History.People>>) => {
    return toAntDPage(rsp)
  })
}

/** 新建规则 POST /api/rule */
export async function addPeople(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/history/people-add', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updatePeople(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/history/people-update', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removePeople(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
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
