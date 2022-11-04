import React, {useEffect, useState} from "react";
import People = History.People;
import {ColumnsType} from "antd/es/table";
import {FormattedMessage} from "@@/exports";
import {message, Table} from "antd";
import PeopleRelation = History.PeopleRelation;
import {iRelateTo, relateToMe} from "@/services/history/listPeople";

export enum RelationType {
  RelateToMe,
  IRelateTo
}

export type RelationsSubTableProps = {
  ParentRecord: People;
  RelationType: RelationType;
};

const RelationsSubTable: React.FC<RelationsSubTableProps> = (props) => {
  const [data, setData] = useState<PeopleRelation[]>();
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<History.PeopleRelation> = [
    {
      key: new Date().getMilliseconds(),
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.people.name" defaultMessage="人物"/>,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.people.relation" defaultMessage="关系"/>,
      dataIndex: 'relation',
    },
    {
      title: <FormattedMessage id="pages.people.relationOrder" defaultMessage="顺位"/>,
      dataIndex: 'relationIdx',
    },
    {
      title: <FormattedMessage id="pages.people.relationStart" defaultMessage="顺位"/>,
      dataIndex: 'relationStart',
    },
    {
      title: <FormattedMessage id="pages.people.relationEnd" defaultMessage="始"/>,
      dataIndex: 'relationEnd',
    }
  ];

  useEffect(() => {
    let func: (para: any) => Promise<any>;
    switch (props.RelationType) {
      case RelationType.RelateToMe:
        func = relateToMe
        break
      case RelationType.IRelateTo:
        func = iRelateTo
        break
      default:
        console.log("props.RelationType is null. try to use a enum")
        return
    }

    setLoading(true)
    func({id: props.ParentRecord.id}).then((rsp: Common.HTTPRsp<PeopleRelation[]>) => {
      if (rsp.success) {
        setData(rsp.data ? rsp.data : [])
      } else {
        message.error('加载失败：' + rsp.error);
      }
    }).finally(() => {
      console.log(1)
      setLoading(false)
    })
  }, []);

  return <Table rowKey={(r: PeopleRelation) => r.name} columns={columns}
                dataSource={data} bordered
                loading={loading}
                pagination={false}/>
}


export default RelationsSubTable
