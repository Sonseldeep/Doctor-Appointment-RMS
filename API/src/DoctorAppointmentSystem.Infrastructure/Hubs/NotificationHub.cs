using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DoctorAppointmentSystem.Infrastructure.Hubs;

[Authorize]
public sealed class NotificationHub : Hub
{
 
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;

        if (userId is not null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(userId));
        }

        await base.OnConnectedAsync();
    }

    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;

        if (userId is not null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(userId));
        }

        await base.OnDisconnectedAsync(exception);
    }

    public static string GetGroupName(string userId) => $"user-{userId}";
}