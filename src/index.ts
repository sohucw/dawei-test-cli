import {Command} from 'commander';
import { version } from '../package.json'
import { create } from './command/create';
import {update} from './command/update';

// 创建命令行工具
// 这里我们用 dawei 当作我的指令名称
// 命令行中使用 dawei xxx 即可触发
const program = new Command('daweitest');
// .vesion 表示可以使用 -V --version 参数查看当前SDK版本
// 我们直接使用 package.json 中的 version 即可
program
    .version(version, '-v --version');
// 调用 version 的参数可以自定义
// .version(version, '-v --version')


program.command('update')
.description('update the dawei-cli')
.action( async () => {
    // await update();
    console.log('update command')
});

program
    .command('create')
    .description('创建一个新项目')
    .argument('[name]', '项目名称')
    .action(async (dirName) => {
        // console.log(`create ${dirName}`)
        await create(dirName)
        if(dirName) {
            console.log(`create ${dirName}`)
            await create(dirName)
        } else  {
            console.log(`create command`)
        }
    });
// parse 会解析 process.argv 中的内容
// 也就是我们输入的指令
program.parse();

