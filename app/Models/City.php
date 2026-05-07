<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = [
        'city_name',
        'note',
        'user_session',
    ];

    /**
     * Scope to filter cities by the current user session.
     */
    public function scopeForUser($query, string $sessionId)
    {
        return $query->where('user_session', $sessionId);
    }
}