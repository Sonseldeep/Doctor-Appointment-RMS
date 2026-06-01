namespace DoctorAppointmentSystem.Domain.Users;

public sealed class Role
{
    public static readonly Role Registered = new(1, "Registered");
    public static readonly Role Doctor     = new(2, "Doctor");
    public static readonly Role Admin      = new(3, "Admin");


    public Role(int id, string name)
    {
        Id = id;
        Name = name;
    }

    public int Id { get; init; }

    public string Name { get; init; }

    public ICollection<User> Users { get; init; } = new List<User>();

}
