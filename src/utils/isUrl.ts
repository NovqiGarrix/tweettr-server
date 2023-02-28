

export default function isUrl(url: string) {

    try {
        return !!new URL(url);
    } catch (error) {
        return false;
    }

}