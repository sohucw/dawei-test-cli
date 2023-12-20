// simple-git用于拉取 git 仓库
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import log from './log';
// 设置预估git clone的时间并展示进度条。
import createLogger from 'progress-estimator';
import chalk from 'chalk';
const figlet = require('figlet');

const goodPrinter = async () => {
    const data = await figlet('欢迎使用 dawei-cli 脚手架');
    console.log(chalk.rgb(40, 156, 193).visible(data));
};

// 初始化进度条
const logger = createLogger({
    spinner: {
        interval: 300, // 变换时间 ms
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
            chalk.blue(item)
        ),
    },
});
// Partial
const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(), // 根目录
    binary: 'git',
    maxConcurrentProcesses: 6, // 最大并发进程数
};
export const clone = async (
    url: string,
    projectName: string,
    options: string[]
): Promise<any> => {
    const git: SimpleGit = simpleGit(gitOptions);
    try {
        // 开始下载代码并展示预估时间进度条
        await logger(git.clone(url, projectName, options), '代码下载中: ', {
            estimate: 7000, // 预计下载时间
        });
        // 下面就是一些相关的提示
        goodPrinter();
        console.log();
        console.log(chalk.blueBright(`==================================`));
        console.log(chalk.blueBright(`=== 欢迎使用 dawei-cli 脚手架 ===`));
        console.log(chalk.blueBright(`==================================`));
        console.log();

        log.success(`项目创建成功 ${chalk.blueBright(projectName)}`);
        log.success(`执行以下命令启动项目：`);
        log.info(`cd ${chalk.blueBright(projectName)}`);
        log.info(`${chalk.yellow('pnpm')} install`);
        log.info(`${chalk.yellow('pnpm')} run dev`);
    } catch (err: any) {
        log.error('下载失败');
        log.error(String(err));
    }
};
