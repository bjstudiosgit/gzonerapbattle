-- Add owner-only deletion to the existing Gingahoo room.
begin;
grant delete on public.backstage_chat_messages to authenticated;
create policy "Members delete their own Gingahoo comments"
on public.backstage_chat_messages for delete to authenticated
using (user_id = (select auth.uid()));
commit;
