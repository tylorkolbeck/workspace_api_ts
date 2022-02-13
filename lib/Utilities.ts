class Utility {
    public static GenerateId(): string {
        const characters =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let UID = "";
        for (let i = 0; i < 25; i++) {
            UID += characters[Math.floor(Math.random() * characters.length)];
        }

        return UID;
    }
}

export default Utility;
