const ObjectUtils = {
    convertAllowFields: (data: object, fields: string[]) => {
        return Object.fromEntries(
            Object.entries(data).filter(([key]) => fields.includes(key))
        );
    }
}
export default ObjectUtils
