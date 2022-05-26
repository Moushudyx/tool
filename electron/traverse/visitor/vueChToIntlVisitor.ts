/*
 * @Author: junyang.le@hand-china.com
 * @Date: 2022-05-25 21:44:23
 * @LastEditTime: 2022-05-26 11:24:42
 * @LastEditors: junyang.le@hand-china.com
 * @Description: your description
 * @FilePath: \tool\electron\traverse\visitor\vueChToIntlVisitor.ts
 */
import type { Visitor } from 'vue-eslint-parser/ast/traverse';
import {
  isVLiteral,
  isVText,
  isVExpressionContainer,
  isVElement,
} from '../../utils/astUtils';
import type { ProcessFile } from '../../types';
import { containsCh } from '../../utils/stringUtils';
import { generateCode } from '../../generate';

export const getVueTemplateChToIntlVisitor = (file: ProcessFile, prefix = '') => {
  if (!file.chTransformedContent) file.chTransformedContent = file.content;
  return {
    enterNode(node) {
      let replaceStr: string;
      switch (node.type) {
        case 'VAttribute':
          if (node.directive) {
            // 目前先不考虑 :attr="`中文`"，:option="{ a: '中文' }"这样的情况
          } else {
            // 不是v指令的情况（缩写也算指令），检查其值是否包含中文
            if (!isVLiteral(node.value) || !containsCh(node.value.value)) return;
            replaceStr = `:${node.key.name}="intl("${prefix}").d("${node.value.value}")"`;
          }
          break;
        case 'VElement':
          /**
           * VElement的children有三种情况，纯文本，表达式，VElement
           * 处理逻辑是这样的，从头遍历过去，当遇到有中文的纯文本时开始，后续的纯文本和表达式放到一起作为一个intl
           * 遍历时遇到VElement则重新开始children里新的intl，该VElement不需要考虑（因为后续遍历还会进到它里面，它自己显然需要单独处理）
           * 有些情况下会问题，如<div>1、{{a}}中文</div>，显然中文前面的节点都被忽略了，暂时不考虑这样的 = =
           */
          {
            let rangeStart: number,
              intlArg = {},
              dStr = '';
            node.children.forEach((child, index) => {
              // 如果rangeStart有值了那就不用考虑它是否含有中文，因为有这种情况<div>中文{{a}}5555</div>
              if (isVText(child) && (containsCh(child.value) || rangeStart)) {
                if (!rangeStart) rangeStart = child.range[0];
                dStr += child.value;
              } else if (isVExpressionContainer(child)) {
                const exprCode = generateCode(child.expression);
                dStr += `\${${exprCode}}`;
                intlArg[`nameMe${index}`] = exprCode;
              } else if (index === node.children.length - 1 || isVElement(child)) {
                // 到达结尾或者遇到VElement，进行替换，并重新计算intl
                const intlArgStr = JSON.stringify(intlArg).replaceAll('"', '');
                replaceStr = `{{ intl("${prefix}${
                  intlArgStr === '{}' ? '' : `, ${intlArgStr}`
                }").d(\`${dStr}\`) }}`;
                file.chTransformedContent =
                  file.chTransformedContent.slice(0, rangeStart) +
                  replaceStr +
                  file.chTransformedContent.slice(
                    index === node.children.length - 1 ? child.range[1] : child.range[0]
                  );
                replaceStr = '';
                rangeStart = null;
                intlArg = {};
                dStr = '';
              }
            });
          }
          break;
      }
      if (replaceStr) {
        file.chTransformedContent =
          file.chTransformedContent.slice(0, node.range[0]) +
          replaceStr +
          file.chTransformedContent.slice(node.range[1]);
      }
    },
    leaveNode() {},
  } as Visitor;
};