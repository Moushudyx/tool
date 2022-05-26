/*
 * @Author: junyang.le@hand-china.com
 * @Date: 2022-01-14 17:23:24
 * @LastEditTime: 2022-05-26 15:15:48
 * @LastEditors: junyang.le@hand-china.com
 * @Description: your description
 * @FilePath: \tool\electron\types.ts
 */
import type { ParseResult as BabelParseResult } from '@babel/parser';
import type { File as BabelFile } from '@babel/types';
import { AST } from 'vue-eslint-parser';

export type Message = {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  description?: string;
};

export type IntlItem = {
  code: string; // 完整的code
  get: string;
  d: string;
  error?: string;
  prefix?: string;
  path?: string;
};

export type IntlResult = IntlItem[];

export type StringObject = { [key: string]: string };

export type State = {
  vars?: StringObject;
  intlResult?: IntlResult;
  path?: string;
};

export type ParseResult = BabelParseResult<BabelFile> & {
  parseError?: string;
};

export type VueParseResult = AST.ESLintProgram & {
  parseError?: string;
};

export type BasicFile = {
  name?: string;
  path: string;
  uid: string;
};

export type TransferFile = BasicFile & {
  content: string;
  chTransformedContent?: string;
  diffPatchOfChTransform?: string;
  parseError?: string;
  intlResult?: IntlResult;
};

export type ProcessFile = TransferFile &
  State & {
    parseResult?: ParseResult;
    vueParseResult?: VueParseResult;
  };

export enum Event {
  SwitchMode = 'switch-mode', // 切换模式
  GetRemoteData = 'get-remote-data',
  UpdateRemoteData = 'update-remote-data',
  AddFile = 'add-file',
  RemoveFile = 'remove-file',
  ResetFiles = 'reset-files', // 清空文件
  RefreshFiles = 'refresh-files', // 刷新文件内容
  StartProcessCh = 'start-process-ch',
  GetFilesSync = 'get-files-sync',
  ScanIntl = 'scan-intl',
  ReScanIntl = 're-scan-intl', // 刷新文件并重新扫描intl
  SetPrefixes = 'set-prefixes',
  SetAllowedFileSuffix = 'set-allowed-suffixes',
  SetExcludedPaths = 'set-excluded-paths',
  Message = 'message', // 后端向前端发送消息
  LaunchEditor = 'launch-editor', // 打开编辑器
  DownloadIntlResult = 'download-intl-result',
  SelectFile = 'select-file',
}
