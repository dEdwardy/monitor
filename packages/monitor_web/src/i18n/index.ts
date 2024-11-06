import { createI18n } from 'vue-i18n'
import zh_CN from './zh_CN'
import en_US from './en_US'

export const i18n = createI18n({
    locale: localStorage.getItem('locale') ?? 'zh_CN',
    legacy: false,
    allowComposition: true,
    messages: {
        zh_CN,
        en_US,
    },
})
