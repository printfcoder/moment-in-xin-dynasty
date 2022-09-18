// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

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
  return request<Common.HTTPRsp<Common.PageData<History.PeopleListItem>>>('/api/history/peoples', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then((rsp: Common.HTTPRsp<Common.PageData<History.PeopleListItem>>) => {
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
function toAntDPage(backendData: Common.HTTPRsp<Common.PageData<History.PeopleListItem>>) {
  let ret: Common.AntDesignPage<History.PeopleListItem> = {
    data: [],
    total: 0,
  }

  if (backendData.data && backendData.data.list) {
    ret.data = backendData.data.list
    ret.total = backendData.data.total
  }

  return ret
}
