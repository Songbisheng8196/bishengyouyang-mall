// 合规文案常量
export const COMPLIANCE_DISCLAIMER = '⚠️ 本页内容仅作日常膳食参考，非医疗诊断，身体不适请及时就医。'
export const COMPLIANCE_PRODUCT_NOTICE = '🍵 本品为普通食品，仅作日常食补食用。'
export const COMPLIANCE_CONSTITUTION_DISCLAIMER = '⚠️ 测评结果仅日常膳食参考，非医疗诊断，身体不适请及时就医。'
export const COMPLIANCE_COURSE_DISCLAIMER = '⚠️ 本课程内容仅作日常养生参考，非医疗诊断，身体不适请及时就医。'
export const COMPLIANCE_ARTICLE_DISCLAIMER = '⚠️ 本文内容仅作日常养生参考，非医疗诊断，身体不适请及时就医。'
export const COMPLIANCE_MEMBER_DISCLAIMER = '🍵 会员权益仅供参考，实际服务内容以平台最新公告为准。'

export const FORBIDDEN_WORDS = [
  '治病', '改善疾病', '药用疗效', '妇科治疗', '治疗', '治愈',
  '医疗', '诊断', '诊疗', '开方', '处方', '药剂', '药方',
  '疗效', '治疗效果', '治愈率', '有效率'
]

export function checkCompliance(text: string): boolean {
  return !FORBIDDEN_WORDS.some(word => text.includes(word))
}