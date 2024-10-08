using Microsoft.AspNetCore.SignalR;

namespace Services.Hubs;

public class MatchEventHub : Hub
{
    public void PropagateEvent(int eventId, object data)
    {
        Clients.All.SendAsync("ReceiveEvent", eventId, data);
    }
}
