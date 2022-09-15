// @ts-ignore
/* eslint-disable */

declare namespace History {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type PeopleListItem = {
    key?: number;
    id?: number;
    name?: string;
    birthday?: string;
    deathday?: string;
  }

  type PeopleList = {
    data?: PeopleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
