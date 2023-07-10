
const cache = {}
const setCache = key => data => {
    cache[key] = data
    return data
}
const memorized = fn => arg => cache[arg] || fn(arg).then(setCache(arg))
const abstract = pairs => class extends Vue {
    gradeNo
    create = () => {
        pairs.forEach(async ({ key, fetch }) => {
            this[key] = await memorized(fetch)(this.gradeNo)
        });
    }
}
// ..in vue
class GradeHomeworkDetail extends abstract([
    { homeworkList, getHomeWorkList },
    { classesInfo, getClassInfo },
    { studentsInfo, getStudentInfo },
]) {
    title = '作业计划'
    subTitle = '每日体育作业'
}

class ActivityGradeDetail extends abstract([
    { TranningList, getTranningList },
    { classesInfo, getClassInfo },
    { studentsInfo, getStudentInfo },
]) {
    title = '训练计划'
    subTitle = '每日闯关练习'
}

