using System;

namespace Deraya.Domain.Primitives
{
    public abstract class Entity
    {
        protected Entity()
        {
        }

        protected Entity(long id)
        {
            Id = id;
        }

        public long Id { get; protected set; }
    }
}
