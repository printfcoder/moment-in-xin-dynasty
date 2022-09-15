// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取规则列表 GET /api/rule */
export async function peoples(
  params: {
    // query
    /** 当前的页码 */
    pageNo?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<Common.HTTPRsp<Common.PageData<History.PeopleListItem>>>('/api/history/peoples', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((rsp: API.HTTPRsp<API.PageData<API.PeopleListItem>>) => {
    return toAntDPage(rsp)
  })
}

/** 新建规则 POST /api/rule */
export async function addPeople(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/history/people', {
    method: 'POST',
    ...(options || {}),
  });
}


/** 新建规则 PUT /api/rule */
export async function updatePeople(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/history/people-add', {
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

/**
 * 转成antDesign的Page格式
 */
function toAntDPage(backendData: API.HTTPRsp<API.PageData<API.PeopleListItem>>) {
  let ret: API.AntDesignPage = {}

  if (backendData.data != null) {
    ret.data = backendData.data.list
    ret.total = backendData.data.total
  }

  return ret
}
