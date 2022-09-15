declare namespace Common {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type HTTPRsp<T> = {
    status?: string;
    success: bool;
    error?: Error;
    data?: T;
  }

  type Error = {
    no: string;
    msg: string;
    oriMsg?: string;
  }

  type PageData<T> = {
    pageNo?: int;
    pageSize?: int;
    total?: int;
    list?: T[];
  }

  type AntDesignPage = {
    data?: any[];
    /** 列表的内容总数 */
    total?: number;
  };
}
