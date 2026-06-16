namespace Deraya.Domain.Enums
{
    public enum UserStatus : byte
    {
        Pending = 1,
        Active = 2,
        Suspended = 3,
        Deleted = 4
    }

    public enum AuthProvider : byte
    {
        Local = 1,
        Google = 2,
        Microsoft = 3
    }

    public enum AvatarProvider : byte
    {
        Local = 1,
        Google = 2,
        Microsoft = 3
    }

    public enum StorageProvider : byte
    {
        Local = 1,
        OneDrive = 2,
        Supabase = 3
    }



    public enum Role : byte
    {
        User = 1,
        Admin = 2
    }
    public enum FileType : byte
    {
        Profile = 1,
        Document = 2,
    }





}
