// @ts-ignore
/* eslint-disable */

declare namespace History {
  type People = {
    key?: number;
    id: number;
    name: string;
    birthDay: string;
    deathDay: string;
  }

  type PeopleRelationEnum = {
    key?: number;
    peopleId: number;
    relation: string;
  }

  type PeopleRelation = {
    key?: number;
    name?: string;
    peopleIDA?: number;
    peopleIDB: number;
    relation: string;
    relationIdx: number;
    relationBegin:  string;
    relationEnd:  string;
  }

  type PeopleRelations = {
    people: People;
    relations: PeopleRelation[];
  }

  type PeopleList = {
    data?: People[];
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
