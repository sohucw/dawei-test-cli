import path from 'path';
import { gt }from 'lodash';
import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import fs from 'fs-extra';
import { select, input, Separator } from '@inquirer/prompts';
import { name, version } from '../../package.json';
import { clone } from '../utils/clone';
import log from '../utils/log';

export interface TemplateInfo {
    name: string; // 项目名称
    downloadUrl: string; // 下载地址
    description: string; // 项目描述
    branch: string; // 项目分支
}
// 这里保存了我写好的两个预设模板 
export const templates: Map<string, TemplateInfo> = new Map(
    [
        ["Vite4-Vue3-Typescript-template", {
            name: "admin-template",
            downloadUrl: 'git@gitee.com:sohucw/admin-pro.git',
            description: 'Vue3技术栈开发模板',
            branch: 'dev8'
        }]
    ]
)
const isOverwrite = async (fileName: string) => {
    log.warning(`${fileName} 文件已存在 !`);
    return select({
        message: '是否覆盖原文件: ',
        choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false },
        ],
    });
};

/**
    获取npm包信息 npm 包提供了根据包名称查询包信息的接口  我们在这里直接使用 axios 请求调用即可
    @param npmName 当前npm包名
    @returns npm包信息
*/
export const getNpmInfo = async (npmName: string) => {
    const npmUrl = 'https://registry.npmjs.org/' + npmName;
    let res = {};
    try {
        res = await axios.get(npmUrl);
    } catch (err) {
        log.error(err as string);
    }
    return res;
};

/**
获取npm包最新版本号
@param npmName 当前npm包名
@returns npm包最新版本
*/
export const getNpmLatestVersion = async (npmName: string) => {
    const { data } = (await getNpmInfo(npmName)) as AxiosResponse;
    // data['dist-tags'].latest 为最新版本号
    // log.error(data);
    return data['dist-tags'].latest;
};
/**
 * @description 检测 npm 包是否需要更新
 * @param name npm 包名称
 * @param curVersion npm 包当前版本
 */
export const checkVersion = async (name: string, version: string) => {
    const latestVersion = await getNpmLatestVersion(name);
    const need = gt(latestVersion, version);
    if (need) {
        log.info(
            `检测到 dawei 最新版:${chalk.blueBright(
                latestVersion
            )} 当前版本:${chalk.blueBright(version)} ~`
        );
        log.info(
            `可使用 ${chalk.yellow(
                'npm'
            )} install dawei-cli@latest 或 ${chalk.yellow(
                'dawei'
            )} update 更新 ~`
        );
    }
    return need;
};

export async function create(projectName?: string) {
    // 初始化模板列表
    const templateList = Array.from(templates).map(
        (item: [string, TemplateInfo]) => {
            const [name, info] = item;
            return {
                name,
                value: name,
                descrition: info.description,
            };
        }
    );
    log.info(`当前可用的模板: ${templateList.map((item) => item.name)}`);
    // 文件名称未传入需要输入
    if (!projectName) {
        projectName = await input({ message: '请输入项目名称' });
    }

    // 如果文件已存在需要让用户判断是否覆盖原文件
    const filePath = path.resolve(process.cwd(), projectName);
    log.error(filePath);

    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(projectName);
        if (run) {
            await fs.remove(filePath);
        } else {
            return; // 不覆盖直接结束
        }
    }

    // 检测版本更新
    await checkVersion(name, version);

    // 选择模板
    const templateName = await select({
        message: '请选择需要初始化的模板',
        choices: templateList,
    });

    const info = templates.get(templateName);
    if (info) {
        await clone(info.downloadUrl, projectName, ['-b', info.branch]);
    } else {
        log.error(`${templateName} 模板不存在`);
    }
}