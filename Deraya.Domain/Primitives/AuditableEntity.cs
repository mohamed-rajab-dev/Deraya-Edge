using System;

namespace Deraya.Domain.Primitives
{
    public abstract class AuditableEntity : Entity
    {
        protected AuditableEntity()
        {
        }

        protected AuditableEntity(long id) : base(id)
        {
            CreatedAt = DateTimeOffset.UtcNow;
        }

        public DateTimeOffset CreatedAt { get; protected set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdatedAt { get; protected set; }
        public DateTimeOffset? DeletedAt { get; protected set; }

        public void MarkUpdated()
        {
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void SoftDelete()
        {
            DeletedAt = DateTimeOffset.UtcNow;
        }
    }
}
