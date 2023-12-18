import process from 'child_process';
import ora from 'ora';
import chalk from 'chalk';
import log from '../utils/log';
const spinner = ora({
    text: 'dawei-cli 正在更新... \n',
    spinner: {
        interval: 80,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) =>
            chalk.blue(item)
        ),
    },
});

// 项目创建流程
export function update() {
    spinner.start();
    process.exec('pnpm install dawei-cli@latest -g', (error) => {
        spinner.stop();
        if (!error) {
            log.success('更新成功 ~');
        } else {
            log.error(`${error}`);
        }
    });
}
